import { withYup } from "@remix-validated-form/with-yup";
import { useRef } from "react";
import { ActionFunction, json } from "remix";
import { ValidatedForm, validationError } from "remix-validated-form";
import * as yup from "yup";
import { Input } from "~/components/Input";
import { SubmitButton } from "~/components/SubmitButton";

const schema = yup.object({
  testinput: yup.string(),
  anotherinput: yup.string(),
});
const validator = withYup(schema);

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // Perform this check without the validator
  // because the validator would stop the submission on the frontend
  const testinput = formData.get("testinput");
  if (testinput === "fail")
    return validationError({
      fieldErrors: {
        testinput: "Don't say that",
      },
    });

  return json({ message: "Submitted!" });
};

export default function FrontendValidation() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <ValidatedForm validator={validator} method="post" resetAfterSubmit>
        <Input name="testinput" label="Test input" ref={inputRef} />
        <SubmitButton label="Submit" submittingLabel="Submitting" />
      </ValidatedForm>
      <ValidatedForm
        validator={validator}
        method="post"
        resetAfterSubmit
        subaction="another-action"
      >
        <Input name="anotherinput" label="Another input" ref={inputRef} />
        <SubmitButton label="Other Submit" submittingLabel="Submitting" />
      </ValidatedForm>
    </>
  );
}
