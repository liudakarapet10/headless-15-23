import {json} from '@shopify/remix-oxygen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, Form} from '@remix-run/react';
import type {AdminClient} from '~/utils/createAdminClient';

const CREATE_CUSTOMER = `#graphql
  mutation createCustomer($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        firstName
        lastName
        email
        id
      }
    }
  }
`;

export async function loader({context}: LoaderFunctionArgs) {
  // console.log(context.admin);
  return null;
}

export async function action({context, request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const admin: AdminClient = context.admin as AdminClient;
  if (!admin) return null;

  const resp = await admin(CREATE_CUSTOMER, {
    variables: {
      input: {
        email: data.email,
        firstName: data.name,
        lastName: data.surname,
      },
    },
  });

  console.log(22, resp);
  // const json2 = await resp.json();

  // console.log(context.admin);
  return json({});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <Form method="post">
        <div>
          <label>
            <input type="text" name="name" />
            <span>Name</span>
          </label>
        </div>
        <div>
          <label>
            <input type="text" name="surname" />
            <span>Surnamew</span>
          </label>
        </div>
        <div>
          <label>
            <input type="text" name="email" />
            <span>Email</span>
          </label>
        </div>
        <button>Submit</button>
      </Form>
    </div>
  );
}
