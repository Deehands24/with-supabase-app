import CheckerboardLogo from './CheckerboardLogo';

export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="flex flex-col items-center gap-8">
        <CheckerboardLogo />
        <h1 className="font-old-english text-6xl font-bold mb-4 text-red-600" style={{ fontFamily: "'Old English Text MT', 'UnifrakturMaguntia', serif" }}>
          Platform.dev
        </h1>
      </div>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-3xl text-center">
        A place for developers to showcase their talents in a library of portfolios.
      </p>
      <p className="text-xl lg:text-2xl !leading-tight mx-auto max-w-3xl text-center text-muted-foreground">
        Create your Platform.dev portfolio and simply add your link to your resume. 
        Employers can view your talent, making it easier for both employers and customers 
        to find the perfect developer for their projects and freelance opportunities.
      </p>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
