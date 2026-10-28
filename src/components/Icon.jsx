import * as Icons from 'lucide-react';
export default function Icon({name,...props}){const C=Icons[name]||Icons.BookOpen;return <C size={18} strokeWidth={1.7} {...props}/>}
