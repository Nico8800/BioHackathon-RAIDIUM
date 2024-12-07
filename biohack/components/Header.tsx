const Header = () => {
    return (
      <header className="fixed top-0 z-50 w-full">
        <nav className="px-8 py-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            {/* Logo minimaliste */}
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              <span className="text-sm font-medium tracking-wider text-white/90">LUMIA</span>
            </div>
  
            {/* Navigation centrale */}
            <div className="hidden md:block">
              <ul className="flex space-x-8">
                {['Analyse', 'Documentation', 'API'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-xs font-light tracking-wide text-white/50 transition-colors hover:text-white"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Bouton connexion */}
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-xs font-light tracking-wide text-white/50 transition-colors hover:text-white"
              >
                Connexion
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Démarrer
              </a>
            </div>
          </div>
        </nav>
  
        {/* Ligne de séparation avec gradient subtil */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </header>
    )
  }
  
  export default Header