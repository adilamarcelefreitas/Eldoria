import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    updateProfile,
  } from "firebase/auth";
  
  import {
    createUser,
    login,
    googleLogin,
    logOut,
  } from "../src/firebase/firebaseAuth";
  
  jest.mock("firebase/auth");
  // Mocks as funções e objetos do Firebase para que possam ser controlados nos testes
  
  describe("Firebase Authentication", () => {
    // Início da descrição do conjunto de testes
  
    afterEach(() => {
      jest.clearAllMocks();
    });
    // Função executada após cada teste para limpar todos os mocks, garantindo que cada teste comece com um ambiente limpo
  
    it("deve criar um usuário com sucesso", async () => {
      // Início do primeiro teste: criação de usuário bem-sucedida
      const email = "euseila@email.com";
      const senha = "123456";
      const nome = "nometeste";
  
      // Mock da função createUserWithEmailAndPassword para retornar um objeto simulado
      createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { displayName: nome } });
  
      // Chama a função createUser e armazena o resultado em "user"
      const user = await createUser(email, senha, nome);
  
      // Verifica se createUserWithEmailAndPassword foi chamada exatamente uma vez
      expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
  
      // Verifica se createUserWithEmailAndPassword foi chamada com os argumentos corretos
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(undefined, email, senha);
  
      // Verifica se a função updateProfile não foi chamada
      expect(updateProfile).not.toHaveBeenCalled();
  
      // Verifica se o "user" retornado possui o displayName correto
      expect(user.displayName).toBe(nome);
    });
  
    it("deve logar com o usuário", async () => {
      const email = "euseila@email.com";
      const senha = "123456";
  
      signInWithEmailAndPassword.mockResolvedValueOnce();
  
      await login(email, senha);
  
      expect(signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(undefined, email, senha);
    });
  
    it("deve logar com o Google", async () => {
      signInWithPopup.mockResolvedValueOnce();
      GoogleAuthProvider.mockReturnValueOnce();
  
      await googleLogin();
  
      expect(signInWithPopup).toHaveBeenCalledTimes(1);
      expect(signInWithPopup).toHaveBeenCalledWith(undefined, {});
    });
  
    it("deve realizar logout do usuário", async () => {
      signOut.mockResolvedValueOnce();
  
      await logOut();
  
      expect(signOut).toHaveBeenCalledTimes(1);
    });
  });
  