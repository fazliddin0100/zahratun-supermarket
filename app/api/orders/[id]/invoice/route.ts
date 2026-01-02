import PDFDocument from 'pdfkit';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;

  const order = {
    id: orderId,
    market: 'ZAHRATUN MARKET',
    items: [
      { name: 'Olma', price: 5000, qty: 2 },
      { name: 'Non', price: 3000, qty: 1 },
    ],
  };

  const doc = new PDFDocument({
    size: [226, 600], // 80mm POS printer
    margin: 10,
  });

  const chunks: Buffer[] = [];

  doc.on('data', (chunk: Buffer) => {
    chunks.push(chunk);
  });

  // ===== PDF CONTENT =====
  doc.fontSize(14).text(order.market, { align: 'center' });
  doc.moveDown();

  let total = 0;
  order.items.forEach((item) => {
    const sum = item.price * item.qty;
    total += sum;
    doc.text(`${item.name}`);
    doc.text(`${item.qty} x ${item.price} = ${sum}`, { align: 'right' });
  });

  doc.moveDown();
  doc.text(`JAMI: ${total} so'm`, { align: 'right' });

  // ❗ MUHIM: end() AVVAL
  doc.end();

  // ❗ end() dan KEYIN kutamiz
  const pdfBuffer = await new Promise<ArrayBuffer>((resolve) => {
    doc.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(
        buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength
        )
      );
    });
  });

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="chek-${orderId}.pdf"`,
    },
  });
}
