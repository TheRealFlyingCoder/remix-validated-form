import { withZod } from "@remix-validated-form/with-zod";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from "remix";
import { validationError, ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { Input } from "~/components/Input";
import { SubmitButton } from "~/components/SubmitButton";

const validator = withZod(
  z.object({
    firstName: zfd.text(
      z.string({
        required_error: "First Name is a required field",
      })
    ),
    lastName: zfd.text(
      z.string({
        required_error: "Last Name is a required field",
      })
    ),
    email: zfd.text(z.string().email("Email must be a valid email").optional()),
    contacts: z.array(
      z.object({
        name: zfd.text(
          z.string({
            required_error: "Name of a contact is a required field",
          })
        ),
      })
    ),
    myCheckbox: zfd.checkbox(),
    daysOfWeek: zfd.repeatable(),
  })
);

const paramSchema = zfd.formData({
  name: zfd.text(z.string().optional()),
  count: zfd.numeric(z.number().optional()),
});

export const action: ActionFunction = async ({ request }) => {
  const result = validator.validate(await request.formData());
  if (result.error) return validationError(result.error);
  const { firstName, lastName } = result.data;

  return { message: `Submitted for ${firstName} ${lastName}!` };
};

export const loader: LoaderFunction = async ({ request }) => {
  const params = paramSchema.parse(new URL(request.url).searchParams);
  if (params.error) throw redirect("/");
  return json(params);
};

export default function FrontendValidation() {
  const loaderData = useLoaderData();
  const actionData = useActionData();

  return (
    <ValidatedForm validator={validator} method="post">
      {loaderData && loaderData.name && loaderData.count && (
        <h1>
          Welcome, {loaderData.name}. You're visitor number {loaderData.count}!
        </h1>
      )}
      {actionData && <h1>{actionData.message}</h1>}
      <Input name="firstName" label="First Name" />
      <Input name="lastName" label="Last Name" />
      <Input name="email" label="Email" />
      <Input name="contacts[0].name" label="Name of a contact" />
      <label>
        Check
        <input name="check" type="checkbox" />
      </label>
      <fieldset>
        <legend>Days of the week</legend>
        <label>
          Monday
          <input name="daysOfWeek" type="checkbox" />
        </label>
        <label>
          Tuesday
          <input name="daysOfWeek" type="checkbox" />
        </label>
        <label>
          Wednesday
          <input name="daysOfWeek" type="checkbox" />
        </label>
      </fieldset>
      <SubmitButton />
    </ValidatedForm>
  );
}
