import './styles/global.css'
import { useForm, useFieldArray } from 'react-hook-form'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const createUserFormSchema = z.object({
  name: z.string()
    .nonempty('O e-mail é obrigatório')
    .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1))
      }).join(' ')
    }),
  email: z.string()
    .nonempty('O e-mail é obrigatório')
    .email('Formato de e-mail inválido')
    .refine(email => { //Retorna os dados apenas do campo selecionado, neste caso Email
      return email.endsWith('@sicredi.com.br')
    }, 'O e-mail deve ser corporativo'),
    //.superRefine((val, ctx) => { //Retorna todos os campos da validação name, email, password ... para testes
    //  return true
    //}),
  password: z.string()
    .min(6, 'A senha precisa de no mínimo 6 caracteres'),
  techs: z.array(z.object({
    title: z.string().nonempty('O título é obrigatório'),
    knowledge: z.coerce.number().min(1, 'Mínimo 1').max(100, 'Máximo 100')
  })).min(2, 'Insira ao menos duas tecnologias')
})
type CreateUserFormData = z.infer<typeof createUserFormSchema>

function App() {
  const { 
    register,
    handleSubmit, 
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  const [output, setOutput] = useState('')

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  })

  function addNewTech() {
    append({title: '', knowledge: 0})
  }

  function createUser(data: any){
    setOutput(JSON.stringify(data, null, 2))
  }

  return (
    <main className='h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center'>
      <form
        onSubmit={handleSubmit(createUser)}
        className='flex flex-col gap-4 w-full max-w-xs'>
        
        <div className='flex flex-col gap-1'>
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            className='border border-zinc-800 text-white shadow-sm rounded h-10 px-3 bg-zinc-900'
            {...register('name')}
          />
          {errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            className='border border-zinc-800 text-white shadow-sm rounded h-10 px-3 bg-zinc-900'
            {...register('email')}
          />
          {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            className='border border-zinc-800 text-white shadow-sm rounded h-10 px-3 bg-zinc-900'
            { ...register('password')}
          />
          {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="" className='flex items-center justify-between'>Tecnologias
            <button type='button' onClick={addNewTech} className='text-emerald-500 text-xs'>
              Adicionar
            </button>
          </label>

            {fields.map((field, index) => {

              return (
                <div key={field.id} className='flex gap-2'>
                  <div className='flex flex-1 flex-col gap-1'>
                    <input
                      type="text"
                      className='border border-zinc-800 text-white shadow-sm rounded h-10 px-3 bg-zinc-900'
                      { ...register(`techs.${index}.title`)}
                    />

                    {errors.techs?.[index]?.title && <span className='text-red-500 text-sm'>{errors.techs?.[index]?.title?.message}</span>}
                  </div>
                  <div className='flex flex-col gap-1'>
                    <input
                      type="number"
                      className='w-16 border border-zinc-800 text-white shadow-sm rounded h-10 px-3 bg-zinc-900'
                      { ...register(`techs.${index}.knowledge`)}
                    />

                    {errors.techs?.[index]?.knowledge && <span className='text-red-500 text-sm'>{errors.techs?.[index]?.knowledge?.message}</span>}
                  </div>
                </div>
              )
            })}

            {errors.techs && <span className='text-red-500 text-sm'>{errors.techs.message}</span>}
        </div>

        <button
          type="submit"
          className='bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600'
        >Salvar</button>
      </form>

      <pre>{output}</pre>
    </main>
  );
}

export default App;
