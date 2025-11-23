@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 8%;
    --foreground: 0 0% 95%;

    --card: 0 0% 12%;
    --card-foreground: 0 0% 95%;

    --popover: 0 0% 10%;
    --popover-foreground: 0 0% 95%;

    --primary: 214 78% 55%;
    --primary-foreground: 0 0% 100%;

    --secondary: 0 0% 20%;
    --secondary-foreground: 0 0% 90%;

    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 65%;

    --accent: 214 60% 45%;
    --accent-foreground: 0 0% 95%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 95%;

    --border: 0 0% 25%;
    --input: 0 0% 20%;
    --ring: 214 78% 55%;

    --cyber-blue: 214 78% 55%;
    --cyber-blue-muted: 214 60% 45%;
    --cyber-dark: 0 0% 8%;
    --cyber-darker: 0 0% 5%;
    --cyber-gray: 0 0% 15%;
    --cyber-light: 0 0% 95%;

    --gradient-cyber: linear-gradient(135deg, hsl(214 78% 55% / 0.1), hsl(214 60% 45% / 0.2));
    --gradient-dark: linear-gradient(180deg, hsl(0 0% 8%), hsl(0 0% 5%));
    --gradient-glow: linear-gradient(90deg, transparent, hsl(214 78% 55% / 0.3), transparent);

    --shadow-cyber: 0 0 20px hsl(214 78% 55% / 0.3);
    --shadow-soft: 0 4px 20px hsl(0 0% 0% / 0.3);
    --shadow-glow: 0 0 40px hsl(214 78% 55% / 0.2);

    --transition-cyber: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground min-h-screen;
  }
}
