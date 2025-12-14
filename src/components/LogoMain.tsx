

import { Image } from "react-bootstrap";


// Just in case for future expansions
const LogoMain = () => {
  const LogoWhite: boolean = false;
  if (LogoWhite)
  {
    return (
      <Image
        src="/W_RATEMY.svg"
        alt="Rate My Tools Logo"
        width={48}
        height={48}
        className="h-10 w-auto"
      />
    )  
  }
  else
  {
    return (
      <Image
        src="/B_RATEMY.svg"
        alt="Rate My Tools Logo"
        width={48}
        height={48}
        className="h-10 w-auto"
      />
    )  
  }
}

export default LogoMain;