export function greet(name: string): string {
  return `Hello, ${name}! Welcome to QCBE-AISTUDIO`;
}

export function greetUpper(name: string): string {
  return greet(name).toUpperCase();
}
