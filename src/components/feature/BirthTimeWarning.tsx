export default function BirthTimeWarning() {
  return (
    <div className="rounded-xl bg-amber-500/[0.1] border border-amber-500/20 px-4 py-3">
      <p className="text-amber-300 text-sm">
        Час народження невідомий — позиції Місяця та будинків можуть бути неточними.
      </p>
    </div>
  );
}
