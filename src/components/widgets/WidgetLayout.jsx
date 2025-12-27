/** @jsx jsx */
import { jsx } from 'hono/jsx';

export const WidgetLayout = ({ children, title }) => {
  return (
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Amiri&display=swap" rel="stylesheet" />
        <style>{`
          body { font-family: 'Inter', sans-serif; }
          .font-arabic { font-family: 'Amiri', serif; }
        `}</style>
      </head>
      <body class="bg-transparent m-0 p-0 overflow-hidden">
        {children}
      </body>
    </html>
  );
};
