import { useMediaQuery } from "usehooks-ts";

export function useMobile() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    return isMobile;
}