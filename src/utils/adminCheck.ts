/**
 * Determina si el espectador actual es un administrador del negocio (tenant_owner o superadmin)
 * o si cuenta con permisos de auditoría/diagnóstico (parámetro ?admin, ?preview, ?debug).
 * Los comensales y clientes habituales retornan `false` para no ver telemetría interna (RAG Nivel 3).
 */
export const isBusinessAdminViewer = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const role = localStorage.getItem('clikchat_role');
    const token = localStorage.getItem('clikchat_auth_token');
    const params = new URLSearchParams(window.location.search);
    const hasAdminParam =
      params.has('admin') ||
      params.has('preview') ||
      params.has('debug') ||
      params.get('role') === 'superadmin' ||
      params.get('role') === 'tenant_owner';

    return Boolean(
      role === 'tenant_owner' ||
      role === 'superadmin' ||
      role === 'admin' ||
      (token && role) ||
      hasAdminParam
    );
  } catch {
    return false;
  }
};
