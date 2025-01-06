import Dhesend from 'resend';

const dhesend = new Dhesend(process.env.DHESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { from, to, subject, htmlBody } = await request.json();

    if (!from || typeof from !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing "from" field.' }),
        { status: 400 }
      );
    };

    if (!Array.isArray(to) || to.length === 0 || !to.every(email => typeof email === 'string')) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing "to" field. Must be an array of email addresses.' }),
        { status: 400 }
      );
    };

    if (!subject || typeof subject !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing "subject" field.' }),
        { status: 400 }
      );
    };

    if (!htmlBody || typeof htmlBody !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing "htmlBody" field.' }),
        { status: 400 }
      );
    };

    const { data, error } = await dhesend.email.send({ from, to, subject, htmlBody });

    if (error) {
      return new Response(
        JSON.stringify({ error: String(error) }),
        { status: 500 }
      );
    };

    return new Response(JSON.stringify({ data }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  };
};
