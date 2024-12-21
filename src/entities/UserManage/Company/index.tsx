import { inputGroups } from '../const';
import { CommonInputField, DynamicInputGroup } from '../ui/CommonInputField';
import { inputContainer } from './index.css';

export function Company() {
  return (
    <div className={inputContainer}>
      <div>
        {inputGroups.map((group, index) => (
          <DynamicInputGroup key={index} fields={group.fields} />
        ))}
      </div>
      <CommonInputField />
    </div>
  );
}
