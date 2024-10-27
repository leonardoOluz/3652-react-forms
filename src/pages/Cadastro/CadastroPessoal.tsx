import { Controller, useForm } from "react-hook-form";
import { Button, Label, Fieldset, Input, Form, Titulo, ErrorMessage } from "../../components";
import InputMusk from "../../components/InputMask";
import { useEffect } from "react";

interface FormCadastroProps {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  senhaVerificada: string;
}


const CadastroPessoal = () => {
  const { register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    watch,
    control,
    reset
  } = useForm<FormCadastroProps>({
    mode: "all",
    defaultValues: {
      email: "",
      nome: "",
      senha: "",
      senhaVerificada: "",
      telefone: "",
    }
  })
  const senha = watch("senha")

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      console.log("Salvou")
    }
  }, [reset, isSubmitSuccessful])

  const validaSenha = {
    obrigatorio: (val: string) => !!val || "Por favor insira sua senha novamente",
    tamanhoMinimo: (val: string) => val.length >= 6 || "A senha deve ter no minimo 6 caractéres",
    senhaIguais: (val: string) => val === senha || "As senhas não conferem",
  }

  const onFormSubmit = (date: FormCadastroProps) => {
    console.log(date)
  }

  const validateEmail = (value: string) => {
    const validateRegex = /^\w+@alura\.com\.br$/
    if (!validateRegex.test(value)) {
      return "O email inserido não é válido"
    }
    return true
  }

  return (
    <>
      <Titulo>Insira alguns dados básicos:</Titulo>
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <Fieldset>
          <Label htmlFor="campo-nome">Nome</Label>
          <Input
            id="campo-nome"
            placeholder="Digite seu nome completo"
            type="text"
            $error={!!errors.nome}
            aria-describedby="error-message-nome"
            {...register("nome", {
              required: "O campo nome é obrigatório",
              minLength: {
                value: 3,
                message: "O campo nome deve ter pelo menos 3 caracteres"
              }
            })}
          />
          {errors.nome && <ErrorMessage id="error-message-nome">{errors.nome.message}</ErrorMessage>}
        </Fieldset>
        <Fieldset>
          <Label htmlFor="campo-email">E-mail</Label>
          <Input
            id="campo-email"
            placeholder="Insira seu endereço de email"
            type="email"
            $error={!!errors.email}
            {...register("email", { required: "O campo email é obrigatório", validate: validateEmail })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </Fieldset>
        <Fieldset>
          <Label>Telefone</Label>
          <Controller
            name="telefone"
            control={control}
            rules={{
              required: "O campo telefone é obrigatório",
              pattern: {
                value: /^\(\d{2}\) \d{5}-\d{4}$/,
                message: "O formato do telefone deve ser (XX) XXXXX-XXXX"
              }
            }}            
            render={({ field }) => (
              <InputMusk
                placeholder="(XX) XXXXX-XXXX"
                mask="(99) 99999-9999"
                $error={!!errors.telefone}
                {...field}
              />
            )}
            />
            {errors.telefone && <ErrorMessage>{errors.telefone.message}</ErrorMessage>}
        </Fieldset>
        <Fieldset>
          <Label htmlFor="campo-senha">Crie uma senha</Label>
          <Input
            id="campo-senha"
            placeholder="Crie uma senha"
            type="password"
            $error={!!errors.senha}
            {...register("senha", {
              required: "O campo senha é obrigatório",
              minLength: {
                value: 6,
                message: "O campo senha deve ter pelo menos 6 caracteres"
              }
            })}
          />
          {errors.senha && <ErrorMessage>{errors.senha.message}</ErrorMessage>}
        </Fieldset>
        <Fieldset>
          <Label htmlFor="campo-senha-confirmacao">Repita a senha</Label>
          <Input
            id="campo-senha-confirmacao"
            placeholder="Repita a senha anterior"
            type="password"
            $error={!!errors.senhaVerificada}
            {...register("senhaVerificada", {
              required: "O campo senha é obrigatório",
              validate: validaSenha,
            })}
          />
          {errors.senhaVerificada && <ErrorMessage>{errors.senhaVerificada.message}</ErrorMessage>}
        </Fieldset>
        <Button type="submit">Avançar</Button>
      </Form>
    </>
  );
};

export default CadastroPessoal;
