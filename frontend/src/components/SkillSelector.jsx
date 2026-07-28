import { useState, useEffect } from 'react';
import Button from 'components/Button';
import Input from 'components/Input';
import { FiPlus, FiX } from 'react-icons/fi';

export default function SkillSelector({
  selectedSkills = [],
  onChange,
  allSkills = [],
  isVacancy = false
}) {
  const [customSkill, setCustomSkill] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const normalizeSkill = (skill, defaultLevel = 3) => {
    const rawName = skill?.name || skill?.nombre || skill?.habilidad_nombre || skill || '';
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    if (!name) return null;
    const rawLevel = skill?.nivel ?? skill?.level ?? skill?.required_level ?? defaultLevel;
    const parsedLevel = Number(rawLevel);
    const level = Number.isFinite(parsedLevel) ? parsedLevel : defaultLevel;
    return {
      skill_id: skill?.habilidad_id || skill?.skill_id || skill?.id || null,
      name,
      level: Math.min(Math.max(level, 1), 5),
      category: skill?.categoria || skill?.category || null,
      is_optional: skill?.is_optional || skill?.es_opcional || false,
      is_custom: skill?.is_custom || false
    };
  };

  const skillKey = (value) => (value || '').toString().trim().toLowerCase();

  const toggleHabilidad = (skill) => {
    const normalized = normalizeSkill(skill);
    if (!normalized) return;
    const key = skillKey(normalized.name);
    
    if (selectedSkills.some((h) => skillKey(h.name) === key)) {
      onChange(selectedSkills.filter((h) => skillKey(h.name) !== key));
    } else {
      if (selectedSkills.length >= 20) {
        setErrorMsg("Límite máximo de 20 habilidades alcanzado.");
        return;
      }
      onChange([...selectedSkills, normalized]);
    }
  };

  const updateSkillProperty = (name, property, value) => {
    const key = skillKey(name);
    onChange(
      selectedSkills.map((h) => {
        if (skillKey(h.name) === key) {
          return { ...h, [property]: value };
        }
        return h;
      })
    );
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (!trimmed) return;
    const key = skillKey(trimmed);
    const existingCatalog = allSkills.find((s) => skillKey(s.name) === key);
    
    if (existingCatalog) {
      if (!selectedSkills.some((h) => skillKey(h.name) === key)) {
        if (selectedSkills.length >= 20) {
          setErrorMsg("Límite máximo de 20 habilidades alcanzado.");
          return;
        }
        onChange([...selectedSkills, normalizeSkill(existingCatalog)]);
      }
      setCustomSkill('');
      return;
    }
    
    if (!selectedSkills.some((h) => skillKey(h.name) === key)) {
      if (selectedSkills.length >= 20) {
        setErrorMsg("Límite máximo de 20 habilidades alcanzado.");
        return;
      }
      onChange([
        ...selectedSkills,
        { skill_id: null, name: trimmed, level: 3, category: null, is_optional: false, is_custom: true }
      ]);
    }
    setCustomSkill('');
  };


  return (
    <div className="flex flex-col gap-3">
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-md">
          {selectedSkills.map((hab) => (
            <div key={hab.skill_id || hab.name} className="inline-flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-200 text-xs rounded-md">
              <span className="font-semibold text-primary-700">{hab.name}</span>
              
              <button
                type="button"
                onClick={() => toggleHabilidad(hab)}
                className="flex items-center justify-center w-4 h-4 rounded-md bg-slate-200 text-slate-700 border border-slate-300 cursor-pointer hover:bg-slate-300 transition-colors ml-1"
                aria-label={`Eliminar ${hab.name}`}
              >
                <FiX size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-end gap-2 max-sm:flex-col max-sm:items-stretch">
          <Input
            label="Agregar habilidad manual"
            placeholder="Ej: Docker, Scrum, UX"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            className="flex-1"
            inputClassName="!h-[34px] !py-0 !text-[0.8125rem] bg-slate-50 border-slate-200"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomSkill();
              }
            }}
          />
          <Button
            size="sm"
            variant="outline"
            icon={<FiPlus />}
            onClick={handleAddCustomSkill}
            className="!h-[34px]"
            type="button"
          >
            Agregar
          </Button>
        </div>
        <p className="text-[11px] text-slate-500">Si no encuentras la habilidad en la lista, agrégala manualmente.</p>
        {errorMsg && (
          <p className="text-[11px] font-semibold text-danger m-0 animate-fade-in">{errorMsg}</p>
        )}
      </div>
      
      {allSkills.length > 0 && (
        <div className="mt-1">
          <div className="flex flex-wrap gap-2">
            {allSkills.slice(0, 35).map((skill) => {
              const isSelected = selectedSkills.some(h => skillKey(h.name) === skillKey(skill.name));
              return (
                <button
                  key={skill.skill_id || skill.id || skill.name}
                  type="button"
                  onClick={() => toggleHabilidad(skill)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'
                  }`}
                >
                  {skill.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
