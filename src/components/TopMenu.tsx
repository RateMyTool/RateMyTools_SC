'use client';

interface TopMenuProps {
  title: string;
}

const TopMenu = ({ title }: TopMenuProps) => {
  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="flex items-center justify-between py-2 px-4">
        
        <div className="flex items-center">
          <img
            src="/RATEMY.png"
            alt="Rate My Tools Logo"
            className="h-8 w-auto"
          />
          <span className="bg-black text-xl font-formal text-white px-2 py-2 rounded">
            {title}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="font-medium px-4 text-black"><strong>
            <a 
            href="#"
            className="text-black hover:underline no-underline"
            >
            Log In
            </a>
            </strong>
            </span>
          <span className="bg-black text-white text-xl font-normal px-3 py-2 rounded">
            <a
            href="#"
            className="text-white hover:underline no-underline"
            >
            <strong>Sign Up</strong>
            </a>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default TopMenu;
