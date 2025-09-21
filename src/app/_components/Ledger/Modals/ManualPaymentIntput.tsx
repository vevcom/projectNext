import Checkbox from '@/components/UI/Checkbox'
import TextInput from '@/components/UI/TextInput'

type Props = {
     bankAccountNumber?: string,
}

export default function ManualPaymentInput({ bankAccountNumber }: Props) {
    return (
        <div>
            <TextInput label="Kontonummer" name="bankAccountNumber" defaultValue={bankAccountNumber}/>
            <TextInput label="Kommentar" name="comment"/>
            <Checkbox label="Jeg bekrefter at beløpet er overført" name="fundsTransferred" required/>
        </div>
    )
}
