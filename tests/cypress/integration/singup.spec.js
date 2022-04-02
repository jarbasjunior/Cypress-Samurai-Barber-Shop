import SigninPage from '../support/pages/signin/signin_page';
import SignupPage from '../support/pages/signup/signup_page';
import Toast from '../support/components/toasts/toasts';
import Alert from '../support/components/alerts/alerts';

describe('Dado que acesso a página de cadastro', () => {
  context('Quando o usuário não tiver e-mail cadastrado', () => {
    const user = { name: 'Jarbas Junior', email: 'jarbas.junior@samuraibs.com.br', password: '123456' };
    before(() => cy.task('removeUser', user.email));

    it('Deve permitir cadastrar novo usuário com sucesso', () => {
      SigninPage.goSignupPage();
      SignupPage.fillForm(user);
      SignupPage.submitForm();
      Toast.mustHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!');
      SigninPage.musthaveLoginForm();
    });
  });

  context('Quando usuário já tiver e-mail cadastrado', () => {
    const user = {
      name: 'Novo usuário', email: 'novo.usuario@samuraibs.com.br', password: '123456', is_provider: true,
    };
    before(() => cy.postUser(user));

    it('Deve proibir cadastro de novo usuário', () => {
      SigninPage.goSignupPage();
      SignupPage.fillForm(user);
      SignupPage.submitForm();
      Toast.mustHaveText('Email já cadastrado para outro usuário.');
      SigninPage.mustNotHaveLoginForm();
    });
  });

  context('Quando e-mail informado for inválido', () => {
    const user = {
      name: 'Usuário Com Email Inválido', email: 'email.invalido.com.br', password: '123456',
    };

    it('Deve exibir mensagem de alerta', () => {
      SigninPage.goSignupPage();
      SignupPage.fillForm(user);
      SignupPage.submitForm();
      Alert.mustHaveText('Informe um email válido');
    });
  });

  context('Quando a senha informada for muito curta', () => {
    const shortPasswords = ['a', '1a', '1a2', '1a2#', '1a2#3'];
    const user = { name: 'Novo usuário', email: 'novo.usuario@samuraibs.com.br' };
    before(() => {
      SigninPage.goSignupPage();
      SignupPage.fillFormWithoutPass(user);
    });

    shortPasswords.forEach((pwd) => {
      it(`Deve exibir mensagem de alerta com a senha |${pwd}|`, () => {
        SignupPage.fillPassword(pwd);
        SignupPage.submitForm();
      });
    });

    afterEach(() => Alert.mustHaveText('Pelo menos 6 caracteres'));
  });

  context('Quando campos obrigatórios estiverem ausentes', () => {
    before(() => {
      SigninPage.goSignupPage();
      SignupPage.submitForm();
    });

    const alertFields = [
      { field: 'Nome', message: 'Nome é obrigatório' },
      { field: 'Email', message: 'E-mail é obrigatório' },
      { field: 'Senha', message: 'Senha é obrigatória' },
    ];

    alertFields.forEach((alert) => {
      it(`Deve exibir mensagem |${alert.message}| campo |${alert.field}| em branco`, () => {
        Alert.mustHaveText(alert.message);
      });
    });
  });
});
