import type { defaultNS, resources } from "@/services/i18n";
import "i18next";

// Arquivo de declaração do i18n e seus recursos
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources;
  }
}
