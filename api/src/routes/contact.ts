import { Router, Request, Response } from 'express';
// import { sendContactMail } from '../services/mail.js'; // Descomentar cuando copies el servicio

const router = Router();

router.post('/contact', async (req: Request, res: Response) => {
  try {
    // Parsear el body (puede venir como string o como objeto)
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // TODO: Descomentar cuando copies el servicio mail
    // const result = await sendContactMail(payload);
    // return res.status(result.status || 200).json(result);

    // Respuesta temporal mientras copias el servicio
    return res.status(200).json({
      success: true,
      message: 'Contacto recibido (configurar servicio de mail)',
      data: payload
    });

  } catch (error) {
    console.error('Error en ruta contact:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud de contacto'
    });
  }
});

export default router;
