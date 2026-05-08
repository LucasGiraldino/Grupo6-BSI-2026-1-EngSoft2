package com.sigaac.service;

import com.sigaac.dto.CpfResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Map;

@Service
public class CpfService {

    @Value("${api.cpf.token:}")
    private String cpfApiToken;

    private final RestTemplate restTemplate = new RestTemplate();

    public CpfResponseDTO consultar(String cpf) {
        if (!validarMatematicamente(cpf)) {
            return CpfResponseDTO.invalido(cpf, "CPF inv\u00e1lido. Verifique os d\u00edgitos e tente novamente.");
        }

        if (!cpfApiToken.isEmpty()) {
            try {
                return consultarApiExterna(cpf);
            } catch (Exception e) {
                return CpfResponseDTO.api(cpf, null, null, null);
            }
        }

        return CpfResponseDTO.api(cpf, null, null, null);
    }

    private CpfResponseDTO consultarApiExterna(String cpf) {
        String url = "https://api.cpfhub.io/cpf/" + cpf;
        try {
            var response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                String nome = (String) body.get("name");
                String birthDate = (String) body.get("birthDate");
                String gender = (String) body.get("gender");

                if (nome != null && !nome.isBlank()) {
                    String sexo = "M".equalsIgnoreCase(gender) ? "MASCULINO"
                        : "F".equalsIgnoreCase(gender) ? "FEMININO" : "OUTRO";
                    return CpfResponseDTO.api(cpf, nome.trim(), birthDate, sexo);
                }
            }
        } catch (HttpClientErrorException.NotFound e) {
            return CpfResponseDTO.invalido(cpf, "CPF n\u00e3o encontrado na base da Receita Federal.");
        } catch (Exception e) {
            return CpfResponseDTO.api(cpf, null, null, null);
        }
        return CpfResponseDTO.api(cpf, null, null, null);
    }

    static boolean validarMatematicamente(String cpf) {
        if (cpf == null || cpf.length() != 11) return false;

        if (cpf.matches("(\\d)\\1{10}")) return false;

        try {
            int[] digits = new int[11];
            for (int i = 0; i < 11; i++) {
                digits[i] = Character.getNumericValue(cpf.charAt(i));
            }

            int sum = 0;
            for (int i = 0; i < 9; i++) {
                sum += digits[i] * (10 - i);
            }
            int remainder = sum % 11;
            int firstDigit = remainder < 2 ? 0 : 11 - remainder;
            if (digits[9] != firstDigit) return false;

            sum = 0;
            for (int i = 0; i < 10; i++) {
                sum += digits[i] * (11 - i);
            }
            remainder = sum % 11;
            int secondDigit = remainder < 2 ? 0 : 11 - remainder;
            return digits[10] == secondDigit;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}
