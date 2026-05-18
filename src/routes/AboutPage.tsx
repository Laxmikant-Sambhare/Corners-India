import Link from '@mui/material/Link'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from '@tanstack/react-router'

export function AboutPage() {
  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Stack
      </Typography>
      <List dense disablePadding>
        <ListItem disableGutters>
          <ListItemText primary={<strong>React 19</strong>} secondary="UI" />
        </ListItem>
        <ListItem disableGutters>
          <ListItemText primary={<strong>Vite 8</strong>} secondary="Dev server & build" />
        </ListItem>
        <ListItem disableGutters>
          <ListItemText
            primary={<strong>TanStack Router</strong>}
            secondary={
              <>
                Typed routes — see <code>src/router.tsx</code>
              </>
            }
          />
        </ListItem>
        <ListItem disableGutters>
          <ListItemText
            primary={<strong>TanStack Query</strong>}
            secondary={
              <>
                Async/server state — <code>QueryClientProvider</code> in{' '}
                <code>main.tsx</code>
              </>
            }
          />
        </ListItem>
        <ListItem disableGutters>
          <ListItemText
            primary={<strong>Zustand</strong>}
            secondary={
              <>
                Client state — <code>src/stores/counter-store.ts</code>
              </>
            }
          />
        </ListItem>
        <ListItem disableGutters>
          <ListItemText
            primary={<strong>MUI</strong>}
            secondary={
              <>
                Components & theme — <code>ThemeProvider</code> in <code>main.tsx</code>
              </>
            }
          />
        </ListItem>
      </List>
      <Typography sx={{ mt: 2 }}>
        <Link component={RouterLink} to="/" underline="hover" fontWeight={500}>
          ← Home
        </Link>
      </Typography>
    </div>
  )
}
