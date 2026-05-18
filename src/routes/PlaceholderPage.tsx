import Typography from '@mui/material/Typography'

type Props = {
  title: string
}

export function PlaceholderPage({ title }: Props) {
  return (
    <Typography variant="h5" component="h1" color="text.secondary">
      {title}
    </Typography>
  )
}
