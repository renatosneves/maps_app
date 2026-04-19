function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }

  return dp[m][n];
}

export function fuzzyMatch(
  input: string,
  target: string,
  aliases?: string[]
): boolean {
  const normalize = (s: string) =>
    s.toLowerCase().trim().replace(/[''.-]/g, '').replace(/\s+/g, ' ');

  const normalizedInput = normalize(input);
  const candidates = [target, ...(aliases ?? [])].map(normalize);

  for (const candidate of candidates) {
    if (normalizedInput === candidate) return true;

    const maxDistance = candidate.length <= 4 ? 1 : candidate.length <= 8 ? 2 : 3;
    if (levenshtein(normalizedInput, candidate) <= maxDistance) return true;
  }

  return false;
}
