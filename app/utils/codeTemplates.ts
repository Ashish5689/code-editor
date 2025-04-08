import { Language } from '../components/LanguageSelector';

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    value: 'javascript',
    extension: 'js',
  },
  {
    id: 'python',
    name: 'Python',
    value: 'python',
    extension: 'py',
  },
  {
    id: 'java',
    name: 'Java',
    value: 'java',
    extension: 'java',
  },
  {
    id: 'cpp',
    name: 'C++',
    value: 'cpp',
    extension: 'cpp',
  },
  {
    id: 'c',
    name: 'C',
    value: 'c',
    extension: 'c',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    value: 'typescript',
    extension: 'ts',
  },
  {
    id: 'csharp',
    name: 'C#',
    value: 'csharp',
    extension: 'cs',
  },
  {
    id: 'ruby',
    name: 'Ruby',
    value: 'ruby',
    extension: 'rb',
  },
];

export const getDefaultCode = (languageId: string): string => {
  switch (languageId) {
    case 'javascript':
      return `// JavaScript Hello World
console.log("Hello, World!");

// You can also try:
const name = "Code Surfer";
console.log(\`Welcome to \${name}!\`);`;

    case 'python':
      return `# Python Hello World
print("Hello, World!")

# You can also try:
name = "Code Surfer"
print(f"Welcome to {name}!")`;

    case 'java':
      return `// Java Hello World
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // You can also try:
        String name = "Code Surfer";
        System.out.println("Welcome to " + name + "!");
    }
}`;

    case 'cpp':
      return `// C++ Hello World
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    // You can also try:
    string name = "Code Surfer";
    cout << "Welcome to " << name << "!" << endl;
    
    return 0;
}`;

    case 'c':
      return `// C Hello World
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    
    // You can also try:
    char name[] = "Code Surfer";
    printf("Welcome to %s!\\n", name);
    
    return 0;
}`;

    case 'typescript':
      return `// TypeScript Hello World
const greeting: string = "Hello, World!";
console.log(greeting);

// You can also try:
const name: string = "Code Surfer";
console.log(\`Welcome to \${name}!\`);`;

    case 'csharp':
      return `// C# Hello World
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
        
        // You can also try:
        string name = "Code Surfer";
        Console.WriteLine($"Welcome to {name}!");
    }
}`;

    case 'ruby':
      return `# Ruby Hello World
puts "Hello, World!"

# You can also try:
name = "Code Surfer"
puts "Welcome to #{name}!"`;

    default:
      return '// Start coding here';
  }
};
