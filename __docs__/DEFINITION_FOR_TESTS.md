# Justificativa Técnica para estratégia de testes

Os testes de integração foram priorizados em uma abordagem que visa avaliar as funcionalidades de ponta a ponta da
aplicação. O objetivo era validar como os componentes interagem entre si e garantir que o sistema entregue uma
experiência fluida e satisfatória ao cliente. Esses testes focaram na verificação de fluxos de usuários, integrações com
sistemas externos e outras funcionalidades críticas do sistema, sem a preocupação de detalhar o comportamento interno de
cada unidade isolada. Essa estratégia não só acelera a identificação de problemas gerais de integração, mas também
proporciona uma visão mais holística de como o sistema se comporta em condições reais de uso, com ênfase na entrega
rápida e eficiente.

Entretanto, os testes unitários foram mantidos em situações específicas em que a complexidade de determinado ponto da
aplicação exigia uma verificação mais detalhada e isolada. Um exemplo disso foi o `circuit breaker` implementado para
gerenciar falhas no banco de dados e nas chamadas externas. A lógica que envolve essas falhas requer testes precisos
para garantir que o sistema se comporte de forma resiliente diante de problemas, como a interrupção de serviços externos
ou falhas em conexões com bancos de dados. Esses testes unitários permitiram isolar e verificar o comportamento dessas
funcionalidades de forma controlada, minimizando o risco de falhas catastróficas.
