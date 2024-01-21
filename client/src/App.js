import Home from "./pages/Home";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

export default function App() {
  const theme = createTheme({
    palette: {
      mode: "dark"
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home />
    </ThemeProvider>
  );
}