import React from 'react';
import { 
  Code, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Lightbulb
} from 'lucide-react';
import type { ElementCategory } from '../recipes';

interface CategoryIconProps {
  category: ElementCategory;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = '', size = 16 }) => {
  switch (category) {
    case 'skill':
      return <Code className={`text-blue-400 ${className}`} size={size} />;
    case 'subject':
      return <BookOpen className={`text-purple-400 ${className}`} size={size} />;
    case 'degree':
      return <GraduationCap className={`text-indigo-400 ${className}`} size={size} />;
    case 'experience':
      return <Briefcase className={`text-emerald-400 ${className}`} size={size} />;
    case 'certification':
      return <Award className={`text-amber-400 ${className}`} size={size} />;
    case 'career':
      return <TrendingUp className={`text-rose-400 ${className}`} size={size} />;
    default:
      return <Lightbulb className={`text-slate-400 ${className}`} size={size} />;
  }
};

// Returns specific color classes for borders or backgrounds based on category
export const getCategoryStyles = (category: ElementCategory) => {
  switch (category) {
    case 'skill':
      return {
        bg: 'bg-blue-500/10 hover:bg-blue-500/15',
        border: 'border-blue-500/30 hover:border-blue-500/50',
        text: 'text-blue-300',
        glow: 'shadow-[0_0_12px_rgba(59,130,246,0.15)]',
      };
    case 'subject':
      return {
        bg: 'bg-purple-500/10 hover:bg-purple-500/15',
        border: 'border-purple-500/30 hover:border-purple-500/50',
        text: 'text-purple-300',
        glow: 'shadow-[0_0_12px_rgba(168,85,247,0.15)]',
      };
    case 'degree':
      return {
        bg: 'bg-indigo-500/10 hover:bg-indigo-500/15',
        border: 'border-indigo-500/30 hover:border-indigo-500/50',
        text: 'text-indigo-300',
        glow: 'shadow-[0_0_12px_rgba(99,102,241,0.15)]',
      };
    case 'experience':
      return {
        bg: 'bg-emerald-500/10 hover:bg-emerald-500/15',
        border: 'border-emerald-500/30 hover:border-emerald-500/50',
        text: 'text-emerald-300',
        glow: 'shadow-[0_0_12px_rgba(16,185,129,0.15)]',
      };
    case 'certification':
      return {
        bg: 'bg-amber-500/10 hover:bg-amber-500/15',
        border: 'border-amber-500/30 hover:border-amber-500/50',
        text: 'text-amber-300',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]',
      };
    case 'career':
      return {
        bg: 'bg-rose-500/10 hover:bg-rose-500/15',
        border: 'border-rose-500/30 hover:border-rose-500/50',
        text: 'text-rose-300',
        glow: 'shadow-[0_0_15px_rgba(244,63,94,0.25)] border-rose-500/40',
      };
  }
};
