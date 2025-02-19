// MUI Imports
import { useDictionary } from '@/components/dictionary-provider/DictionaryContext'
import Link from '@/components/Link'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useParams } from 'next/navigation'

const ProductAddHeader = ({ onSubmit }: { onSubmit: () => void }) => {
  const { lang:locale} = useParams();
  const {dictionary} = useDictionary();
  return (
    <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
      <div>
        <Typography variant='h4' className='mbe-1'>
          {dictionary['content'].addEmployee}
        </Typography>
        {/* <Typography>Orders placed across your store</Typography> */}
      </div>
      <div className='flex flex-wrap max-sm:flex-col gap-4'>
        {/* <Button variant='tonal' color='secondary'>
          Discard
        </Button>
        <Button variant='tonal'>Save Draft</Button> */}
        <Button variant='tonal'  component={Link}  color='secondary' href={`/${locale}/employees`} > {dictionary['content'].back}</Button>
        <Button 
        variant='contained'
        onClick={onSubmit}
        >
           {dictionary['content'].save}
        </Button>
      </div>
    </div>
  )
}

export default ProductAddHeader
