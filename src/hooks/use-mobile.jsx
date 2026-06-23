// src/hooks/use-mobile.jsx
import { useEffect, useState } from 'react';
export default function useMobile(){
  const [isMobile, setIsMobile] = useState(false);
  useEffect(()=>{
    const match = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    setIsMobile(Boolean(match));
  },[]);
  return isMobile;
}
