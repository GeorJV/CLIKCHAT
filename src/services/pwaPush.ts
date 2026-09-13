// PWA & Web Push Notification Client Service

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerPWA() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registrado con éxito:', reg.scope);
      return reg;
    } catch (err) {
      console.warn('⚠️ Error registrando Service Worker:', err);
    }
  }
  return null;
}

export async function subscribeUserToPush(sessionId: string) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications no son soportadas en este navegador.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.log('Permiso de notificaciones denegado por el usuario.');
      return null;
    }

    const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
    const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey
    });

    // Enviar suscripción al backend
    await fetch('/api/chat/push-subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        subscription
      })
    });

    console.log('🔔 Suscripción Push guardada para la sesión:', sessionId);
    return subscription;
  } catch (err) {
    console.error('Error al suscribir a notificaciones push:', err);
    return null;
  }
}
