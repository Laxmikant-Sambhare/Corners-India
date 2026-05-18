import Stack from "@mui/material/Stack";
import { ExploreCategorySection } from "../components/ExploreCategorySection";

export function HomePage() {
  return (
    <Stack
      spacing={0}
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <ExploreCategorySection />
    </Stack>
  );
}
