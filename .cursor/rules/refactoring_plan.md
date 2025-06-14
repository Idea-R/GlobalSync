# PersonalTimeHero.tsx Refactoring Plan & Checklist

## CRITICAL VIOLATION IDENTIFIED
**File**: `src/components/PersonalTimeHero.tsx`  
**Current Size**: 733 lines  
**Issue**: VIOLATES 500-line rule (Forbidden #3)  
**Priority**: IMMEDIATE ACTION REQUIRED

## Seven Levels of "Why?" Analysis (Philosophy #2)

1. **Why is PersonalTimeHero.tsx 733 lines?** - Multiple concerns mixed in one component
2. **Why are multiple concerns mixed?** - No separation of responsibilities during development
3. **Why wasn't separation implemented initially?** - Lack of design patterns and architectural planning
4. **Why wasn't architectural planning done?** - Time pressure and rapid feature addition
5. **Why did rapid feature addition occur?** - Business requirements and iterative development
6. **Why weren't boundaries established?** - Missing code review processes and standards
7. **Why weren't standards enforced?** - Lack of automated tools and team guidelines

## Web Research Findings (Rule #6)

Based on 2024-2025 React best practices research:
- **Compound Component Pattern** - Ideal for complex UI with shared state
- **Custom Hooks Pattern** - For reusable logic extraction
- **Separation of Concerns** - Critical for maintainability
- **Functional Components with Hooks** - Modern React standard
- **Context API Pattern** - For state sharing without prop drilling

## Master Refactoring Checklist

### Phase 1: Preparation (BEFORE touching code)
- [x] **Backup Original File** - PersonalTimeHero.tsx → archive/PersonalTimeHero_backup.md
- [x] **Create Required Directories** - logs/, .cursor/rules/, archive/
- [x] **Document Current State** - index.md, _change.logs
- [ ] **Create Test Plan** - Ensure functionality preservation
- [ ] **Set up Development Environment** - Install dependencies, run dev server

### Phase 2: Initial Separation (Target: Reduce to ~400 lines)
- [ ] **Extract Profile Initialization Component** (~100 lines)
  - Create: `ProfileInitialization.tsx`
  - Move: Initial setup form logic
- [ ] **Extract Settings Panel Component** (~150 lines)
  - Create: `SettingsPanel.tsx`  
  - Move: Configuration modal logic
- [ ] **Extract Import/Export Logic** (~50 lines)
  - Create: Custom hook `useDataImportExport.ts`
  - Move: All import/export functionality
- [ ] **Extract Name Editing Logic** (~30 lines)
  - Create: Custom hook `useNameEditor.ts`
  - Move: Inline name editing functionality

### Phase 3: Component Architecture (Target: <300 lines each)
- [ ] **Create Time Display Component**
  - File: `TimeDisplay.tsx`
  - Responsibility: Current time and timezone display
- [ ] **Create Status Management Component**
  - File: `StatusSelector.tsx`
  - Responsibility: Status dropdown and management
- [ ] **Create Header Component**
  - File: `PersonalHeroHeader.tsx`
  - Responsibility: Title, name editing, action buttons

### Phase 4: Custom Hooks Creation
- [ ] **usePersonalTimeHero Hook**
  - File: `usePersonalTimeHero.ts`
  - Consolidate: Main component state and effects
- [ ] **useTimeManager Hook**
  - File: `useTimeManager.ts`
  - Handle: Time updates and timezone logic
- [ ] **useStatusManager Hook**
  - File: `useStatusManager.ts`
  - Handle: Status changes and auto-status

### Phase 5: Context Implementation (If Needed)
- [ ] **Evaluate Context Need**
  - Assess: State sharing between components
  - Decide: Context vs props approach
- [ ] **Create PersonalHeroContext** (if needed)
  - File: `PersonalHeroContext.tsx`
  - Share: Common state between child components

## Work Breakdown Structure (WBS) Subchecklist

### WBS 1: File Structure Setup
- [ ] Create `src/components/PersonalTimeHero/` directory
- [ ] Create subdirectories: `components/`, `hooks/`, `utils/`
- [ ] Set up index.ts for clean exports
- [ ] Create individual component files

### WBS 2: Logic Extraction
- [ ] Identify reusable logic blocks
- [ ] Extract to custom hooks
- [ ] Test hook functionality independently
- [ ] Integrate hooks into components

### WBS 3: Component Creation
- [ ] Build ProfileInitialization component
- [ ] Build SettingsPanel component  
- [ ] Build TimeDisplay component
- [ ] Build StatusSelector component
- [ ] Build PersonalHeroHeader component

### WBS 4: Main Component Reconstruction
- [ ] Create new PersonalTimeHero using compound pattern
- [ ] Integrate all child components
- [ ] Ensure prop interfaces match
- [ ] Maintain backward compatibility

### WBS 5: Testing & Validation
- [ ] Component functionality testing
- [ ] Props passing validation
- [ ] State management verification
- [ ] Performance comparison
- [ ] TypeScript error resolution

## File Structure Plan

```
src/components/PersonalTimeHero/
├── index.ts                     # Main exports
├── PersonalTimeHero.tsx        # Main component (<200 lines)
├── components/
│   ├── ProfileInitialization.tsx
│   ├── SettingsPanel.tsx
│   ├── TimeDisplay.tsx
│   ├── StatusSelector.tsx
│   └── PersonalHeroHeader.tsx
├── hooks/
│   ├── usePersonalTimeHero.ts
│   ├── useTimeManager.ts
│   ├── useStatusManager.ts
│   ├── useNameEditor.ts
│   └── useDataImportExport.ts
└── utils/
    └── helpers.ts
```

## Success Criteria

- [ ] **No file exceeds 500 lines** (Philosophy #1)
- [ ] **Main component under 300 lines**
- [ ] **Each component has single responsibility**
- [ ] **All existing functionality preserved**
- [ ] **TypeScript errors resolved**
- [ ] **Performance maintained or improved**
- [ ] **Clean prop interfaces**
- [ ] **Proper error handling**

## Risk Mitigation

- **Backup Strategy**: Original file preserved in archive/
- **Incremental Approach**: One component at a time
- **Testing Strategy**: Functional testing after each phase
- **Rollback Plan**: Git commits after each successful phase

## Timeline Estimate

- **Phase 1**: 1 hour
- **Phase 2**: 4 hours  
- **Phase 3**: 6 hours
- **Phase 4**: 4 hours
- **Phase 5**: 2 hours (if needed)
- **Total**: ~17 hours

## Review Points

After each phase:
1. Check line counts
2. Verify functionality
3. Run TypeScript checks
4. Test component integration
5. Update documentation
6. Commit changes 