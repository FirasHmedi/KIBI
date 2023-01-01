import { Layout } from '../components/Layout';
import { SignIn } from '../pages/registration/SignIn';
import Home from '../pages/home/Home';
import { SignUp } from '../pages/registration/SignUp';

export const routes = [
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/signup',
    element: (
      <Layout>
        <SignUp />
      </Layout>
    ),
  },
  {
    path: '/signin',
    element: (
      <Layout>
        <SignIn />
      </Layout>
    ),
  },
];
