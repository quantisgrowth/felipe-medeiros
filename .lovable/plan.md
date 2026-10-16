# Checagem de senhas na tela de nova senha

Na tela "definir nova senha" (aberta pelo link de redefinição), comparar em tempo real o campo "Nova senha" com "Confirmar senha".

- Mensagem aparece abaixo de "Confirmar senha" assim que algo for digitado nele.
- Iguais: "Tá certinho, pode confirmar" (verde, ícone de check).
- Diferentes: "Tem algo errado ai na senha" (vermelho, ícone de alerta).
- Mensagem anunciada para leitores de tela (aria-live).
- Validação existente no envio continua igual.

## Detalhes técnicos
- `src/routes/manager-felipe/login.tsx`: transformar os dois campos em controlados (`newPassword`, `confirmPassword` em state), renderizar mensagem condicional com tokens semânticos e `aria-describedby`.
