// Small number helpers shared by the pages. All data now comes from Supabase (src/lib/data).

export const fmt = (n) => Math.round(n).toLocaleString('en-US')
export const num = (v) => parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0
