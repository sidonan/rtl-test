import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeedbackForm } from "../FeedbackForm";

describe("FeedbackForm", () => {
  test("Проверка заголовка", () => {
    render(<FeedbackForm />);
    expect(screen.getByText("Обратная связь")).toBeInTheDocument();
  });

  test("Ввод имени и сообщения", async () => {
    render(<FeedbackForm />);
    const nameInput = screen.getByPlaceholderText("Ваше имя");
    const messageInput = screen.getByPlaceholderText("Ваше сообщение");

    await userEvent.type(nameInput, "Ния");
    await userEvent.type(messageInput, "Привет!");

    expect(nameInput).toHaveValue("Ния");
    expect(messageInput).toHaveValue("Привет!");
  });

  test("Отправка формы с валидными данными", async () => {
    render(<FeedbackForm />);
    const nameInput = screen.getByPlaceholderText("Ваше имя");
    const messageInput = screen.getByPlaceholderText("Ваше сообщение");
    const button = screen.getByRole("button", { name: /отправить/i });
  
    await userEvent.type(nameInput, "Раха");
    await userEvent.type(messageInput, "Тестовое сообщение");
    await userEvent.click(button);
  
    const confirmation = await screen.findByText(
      (content) => content.includes("Спасибо, Раха!"),
      {},
      { timeout: 2000 } 
    );
  
    expect(confirmation).toBeInTheDocument();
  });
  

  test("Сообщение не отправляется при пустом вводе", async () => {
    render(<FeedbackForm />);
    const button = screen.getByRole("button", { name: /отправить/i });

    await userEvent.click(button);
    const confirmation = await screen.queryByText(/спасибо/i);
    expect(confirmation).not.toBeInTheDocument();
  });

  test("Кнопка существует и активна", () => {
    render(<FeedbackForm />);
    const button = screen.getByRole("button", { name: /отправить/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  test("Trim-валидация: пробелы не считаются", async () => {
    render(<FeedbackForm />);
    const nameInput = screen.getByPlaceholderText("Ваше имя");
    const messageInput = screen.getByPlaceholderText("Ваше сообщение");
    const button = screen.getByRole("button", { name: /отправить/i });

    await userEvent.type(nameInput, "   ");
    await userEvent.type(messageInput, "   ");
    await userEvent.click(button);

    const confirmation = await screen.queryByText(/спасибо/i);
    expect(confirmation).not.toBeInTheDocument();
  });
});
