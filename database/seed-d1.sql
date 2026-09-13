-- Seed data for Cloudflare D1
INSERT OR IGNORE INTO tenants (
    id, slug, name, owner_email, owner_name, bot_name, avatar_url,
    welcome_message, system_prompt, primary_color, cta_text, cta_url, plan, monthly_price, status
) VALUES 
(
    'a0000000-0000-0000-0000-000000000001',
    'acme-store',
    'ClikChat Boutique & Tech',
    'tienda@clikchat.com',
    'Carlos Mendoza',
    'Sofía - Asesora VIP',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    '¡Hola! Te doy la bienvenida a ClikChat Boutique. Soy Sofía, tu asistente de ventas personal. ¿Te gustaría conocer nuestras promociones del día o detalles de algún producto?',
    'Eres Sofía, una asesora comercial de alto nivel de ClikChat Boutique. Tu tono es sofisticado, persuasivo y muy servicial. Cuando hables de productos, destaca sus beneficios clave y llama al usuario a comprarlos o consultarlos de inmediato.',
    '#6366f1',
    'Comprar con Descuento',
    'https://wa.me/50688888888?text=Hola%20Sofía,%20deseo%20comprar%20desde%20ClikChat',
    'pro',
    79.00,
    'active'
);

INSERT OR IGNORE INTO products (
    id, tenant_id, name, slug, price, currency, short_description, full_description, images, benefits, details, cta_label, cta_url, is_active
) VALUES 
(
    'd0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Smartwatch Titan Pro Series 9',
    'smartwatch-titan-pro-series-9',
    129.99,
    'USD',
    'Reloj inteligente premium con pantalla AMOLED Ultra HD de 1.95 pulgadas.',
    'El Titan Pro Series 9 combina elegancia y tecnología de vanguardia. Equipado con caja de aleación de titanio grado aeroespacial, monitor de salud integral (frecuencia cardíaca, SpO2, estrés, calidad de sueño en tiempo real) y más de 120 modos deportivos.',
    '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"]',
    '["Pantalla AMOLED de 1.95 pulgadas con cristal de zafiro anti-rayaduras","Batería de larga duración de hasta 14 días con una sola carga rápida","Monitoreo continuo de salud médica: ECG, Oxígeno en sangre y ritmo cardíaco","Resistencia al agua 5 ATM ideal para natación y deportes acuáticos"]',
    '{"Pantalla":"1.95 AMOLED Always-on","Batería":"420 mAh (14 días típicos)","Material":"Aleación de Titanio Grado 5","Conectividad":"Bluetooth 5.3 + GPS Satelital Dual","Compatibilidad":"iOS 13+ y Android 9+"}',
    'Pedir Smartwatch ($129.99)',
    'https://wa.me/50688888888?text=Hola,%20deseo%20comprar%20el%20Smartwatch%20Titan%20Pro',
    1
),
(
    'd0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'Audífonos Titanium Noise-Cancelling Max',
    'audifonos-titanium-noise-cancelling-max',
    189.00,
    'USD',
    'Auriculares inalámbricos de alta fidelidad con cancelación activa de ruido híbrida de 45dB.',
    'Experimenta un audio inmersivo con controladores de neodimio de 40mm y cancelación activa de ruido de hasta 45dB. Batería de 60 horas continuas, almohadillas viscoelásticas transpirables y conectividad Bluetooth 5.4 multipunto.',
    '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"]',
    '["Cancelación de ruido activa híbrida inteligente (-45dB)","Hasta 60 horas de batería con carga rápida USB-C (10 min = 5 hrs)","Códec LDAC y audio de alta resolución certificado","Micrófonos con reducción de ruido ambiental por IA para llamadas nítidas"]',
    '{"Peso":"250 gramos ultra livianos","Tipo":"Over-Ear Circumauriculares","Control":"Superficie táctil capacitiva y botón de transparencia","Batería":"800 mAh Li-Po con 60h de autonomía","Conectividad":"Bluetooth 5.4 + Cable jack 3.5mm libre de oxígeno"}',
    'Adquirir Audífonos ($189)',
    'https://wa.me/50688888888?text=Hola,%20deseo%20comprar%20los%20Audifonos%20Titanium',
    1
);

INSERT OR IGNORE INTO faqs (
    id, tenant_id, question, answer, keywords, category, confidence_threshold, is_active
) VALUES 
(
    'f0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    '¿Cuáles son los métodos de pago aceptados?',
    'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias directas, SINPE Móvil, PayPal y pago contra entrega en ciudades principales.',
    '["pago","tarjeta","transferencia","sinpe","paypal","efectivo","contraentrega"]',
    'pagos',
    0.65,
    1
),
(
    'f0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    '¿Cuánto tarda el envío y cuál es el costo?',
    'El envío es totalmente gratuito en compras superiores a $50 USD. Para entregas estándar el plazo es de 24 a 48 horas hábiles. Para zonas rurales o internacionales, el tiempo de tránsito es de 3 a 5 días hábiles con número de rastreo incluido.',
    '["envio","costo","tiempo","tarda","cuanto demora","domicilio","gratis","entrega"]',
    'envios',
    0.65,
    1
),
(
    'f0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    '¿Qué garantía tienen los productos y cuál es la política de devoluciones?',
    'Todos nuestros dispositivos cuentan con 12 meses de garantía oficial directa contra cualquier defecto de fábrica. Además, cuentas con 30 días naturales para cambios o devoluciones sin costo si el producto no cumple con tus expectativas.',
    '["garantia","devolucion","cambio","reembolso","defecto","fallas"]',
    'garantias',
    0.65,
    1
);
