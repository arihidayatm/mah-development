/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JIRA_BASE?: string
  readonly VITE_JIRA_EMAIL?: string
  readonly VITE_JIRA_TOKEN?: string
  readonly VITE_JIRA_PROJECT?: string
  readonly VITE_USE_JIRA_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
