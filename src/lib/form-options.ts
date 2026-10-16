export const DEFAULT_ROLES = [
  "Sócio(a) / Proprietário(a)",
  "CEO / Diretor(a) executivo(a)",
  "Diretor(a) comercial",
  "Gerente comercial",
  "Coordenador(a) comercial",
  "Gestor(a) de pré-vendas",
  "Diretor(a) financeiro(a)",
  "Gerente financeiro(a)",
  "Diretor(a) de operações",
  "Gerente de operações",
  "Gerente administrativo(a)",
  "Outro",
];
export const DEFAULT_SEGMENTS = [
  "Tecnologia / SaaS",
  "Serviços profissionais",
  "Consultoria",
  "Agência / Marketing",
  "Comércio / Varejo",
  "Indústria",
  "Construção / Imobiliário",
  "Saúde",
  "Educação",
  "Logística / Transportes",
  "Serviços financeiros",
  "Outro",
];
export const OPERATION_TOOLS = [
  "CRM",
  "Discador",
  "Ferramenta de Pré-Venda",
  "WhatsApp",
  "Automações",
  "Agentes de IA",
];
export const COUNTRIES = [
  { code: "BR", flag: "🇧🇷", name: "Brasil", dial: "55" },
  { code: "PT", flag: "🇵🇹", name: "Portugal", dial: "351" },
  { code: "US", flag: "🇺🇸", name: "Estados Unidos", dial: "1" },
  { code: "CA", flag: "🇨🇦", name: "Canadá", dial: "1" },
  { code: "AR", flag: "🇦🇷", name: "Argentina", dial: "54" },
  { code: "CL", flag: "🇨🇱", name: "Chile", dial: "56" },
  { code: "CO", flag: "🇨🇴", name: "Colômbia", dial: "57" },
  { code: "UY", flag: "🇺🇾", name: "Uruguai", dial: "598" },
  { code: "PY", flag: "🇵🇾", name: "Paraguai", dial: "595" },
  { code: "PE", flag: "🇵🇪", name: "Peru", dial: "51" },
  { code: "MX", flag: "🇲🇽", name: "México", dial: "52" },
  { code: "ES", flag: "🇪🇸", name: "Espanha", dial: "34" },
  { code: "GB", flag: "🇬🇧", name: "Reino Unido", dial: "44" },
  { code: "FR", flag: "🇫🇷", name: "França", dial: "33" },
  { code: "DE", flag: "🇩🇪", name: "Alemanha", dial: "49" },
  { code: "IT", flag: "🇮🇹", name: "Itália", dial: "39" },
  { code: "AO", flag: "🇦🇴", name: "Angola", dial: "244" },
  { code: "MZ", flag: "🇲🇿", name: "Moçambique", dial: "258" },
];
export function normalizeOptions(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return [...fallback];
  const options = [
    ...new Set(
      value
        .filter((v): v is string => typeof v === "string")
        .map((v) => v.trim())
        .filter(Boolean),
    ),
  ];
  return options.length ? options : [...fallback];
}
export function internationalPhone(country: string, national: string): string | undefined {
  const selected = COUNTRIES.find((c) => c.code === country);
  const digits = national.replace(/\D/g, "");
  if (!selected || digits.length < 6 || selected.dial.length + digits.length > 15) return undefined;
  if (country === "BR" && !/^[1-9]{2}\d{8,9}$/.test(digits)) return undefined;
  return `+${selected.dial}${digits}`;
}
