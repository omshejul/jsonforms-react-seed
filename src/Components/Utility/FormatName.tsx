export function FormatName(text: string): string {
    const formattedText = text.toLowerCase().replace(/[\s_]/g, '-');
    return formattedText;
}