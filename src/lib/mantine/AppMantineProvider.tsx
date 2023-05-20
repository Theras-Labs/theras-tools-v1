import { MantineProvider } from "@mantine/core";
import type { FC, ReactNode } from "react";

export const AppMantineProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        colors: {
          black: ["#000000"],
          orange: ["#EC3C2B"],
          white: ["#ffffff"],
        },
        fontSizes: {
          xxl: "1.4rem",
          xxxl: "1.6rem",
        },
        fontFamily: "Space Grotesk, sans-serif",
      }}
    >
      {children}
    </MantineProvider>
  );
};
