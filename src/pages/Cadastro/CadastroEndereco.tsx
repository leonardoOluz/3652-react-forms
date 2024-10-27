import { Controller, useForm } from "react-hook-form";
import {
  Button,
  ErrorMessage,
  Fieldset,
  Form,
  FormContainer,
  Input,
  Label,
  Titulo,
} from "../../components";
import InputMusk from "../../components/InputMask";
import { useEffect } from "react";

interface IFormInputEndereco {
  cep: string
  rua: string
  numero: string
  bairro: string
  localidade: string
}

interface IData {
  bairro: string;
  cep: string
  complemento: string
  ddd: string;
  estado: string;
  gia: string;
  ibge: string
  localidade: string;
  logradouro: string;
  regiao: string;
  siafi: string;
  uf: string;
  unidade: string;
}

const CadastroEndereco = () => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitSuccessful },
    reset
  } = useForm<IFormInputEndereco>({
    mode: "all",
    defaultValues: {
      bairro: "",
      cep: "",
      localidade: "",
      numero: "",
      rua: "",
    }
  })

  const cepDigitado = watch("cep");

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset])

  const aoSubmit = (dados: IFormInputEndereco) => {
    console.log(dados)
  }


  const fetchConsultaCep = async (cep: string) => {

    if (!cep) {
      setError("cep", {
        type: "modal",
        message: "Cep inválido!"
      })
      return
    }

    try {
      const response = await fetch(`http://viacep.com.br/ws/${cep}/json/`);
      const data: IData = await response.json();

      if (response.ok) {
        setValue("rua", data.logradouro);
        setValue("bairro", data.bairro);
        setValue("localidade", `${data.localidade}, ${data.uf}`);
      } else {
        throw new Error("Erro ao buscar CEP");
      }

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Titulo>Agora, mais alguns dados sobre você:</Titulo>
      <Form onSubmit={handleSubmit(aoSubmit)}>

        <Controller
          control={control}
          name="cep"
          rules={{ required: "Campo obrigatório" }}
          render={({ field }) => (
            <Fieldset>
              <Label htmlFor="campo-cep">CEP</Label>
              <InputMusk
                mask="99999-999"
                id="campo-cep"
                placeholder="Insira seu CEP"
                onBlur={() => fetchConsultaCep(cepDigitado)}
                onChange={field.onChange}
                value={field.value}
                $error={!!errors.cep}
              />
              {errors.cep && <ErrorMessage>{errors.cep?.message}</ErrorMessage>}
            </Fieldset>
          )}
        />


        <Fieldset>
          <Label htmlFor="campo-rua">Rua</Label>
          <Input
            id="campo-rua"
            placeholder="Rua Agarikov"
            type="text" {...register("rua", { required: "Campo obrigatório" })}
            $error={!!errors.rua}
          />
          {errors.rua && <ErrorMessage>{errors.rua?.message}</ErrorMessage>}

        </Fieldset>

        <FormContainer>
          <Fieldset>
            <Label htmlFor="campo-numero-rua">Número</Label>
            <Input
              id="campo-numero-rua"
              placeholder="Ex: 1440"
              type="text" {...register("numero", { required: "Campo obrigatório" })}
              $error={!!errors.numero}
            />
            {errors.numero && <ErrorMessage>{errors.numero?.message}</ErrorMessage>}
          </Fieldset>
          <Fieldset>
            <Label htmlFor="campo-bairro">Bairro</Label>
            <Input
              id="campo-bairro"
              placeholder="Vila Mariana"
              type="text" {...register("bairro", { required: "Campo obrigatório" })}
              $error={!!errors.bairro}
            />
            {errors.bairro && <ErrorMessage>{errors.bairro.message}</ErrorMessage>}
          </Fieldset>
        </FormContainer>
        <Fieldset>
          <Label htmlFor="campo-localidade">Localidade</Label>
          <Input
            id="campo-localidade"
            placeholder="São Paulo, SP"
            type="text"
            {...register("localidade", { required: "Campo obrigatório" })}
            $error={!!errors.localidade}
          />
          {errors.localidade && <ErrorMessage>{errors.localidade?.message}</ErrorMessage>}
        </Fieldset>
        <Button type="submit">Cadastrar</Button>
      </Form>
    </>
  );
};

export default CadastroEndereco;
