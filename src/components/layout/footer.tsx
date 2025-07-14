import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";

export function Footer() {
  return (
    <footer className="w-full min-w-0 flex flex-col items-center justify-center py-8 md:py-12 bg-background border-t border-border relative overflow-hidden">
      <GoogleGeminiEffect pathLengths={[]} />
      <div className="w-full max-w-4xl flex flex-col items-center justify-center relative z-10 px-4">
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full" style={{ minHeight: 80 }}>
            <div className="flex flex-col items-center justify-center">
              <span style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: 'white',
                textShadow: '0 2px 16px rgba(0,0,0,0.25), 0 1px 0 #000',
                letterSpacing: '0.05em',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))',
              }} className="dark:text-white text-gray-900 text-center">
                <TextHoverEffect text="KindCampus" />
              </span>
              <span className="mt-2 text-xs sm:text-sm text-muted-foreground/80 font-mono text-center">
                by <ContainerTextFlip words={["anish sarkar", "to GDG On Campus team application"]} interval={2600} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 