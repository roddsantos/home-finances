import { Observable } from "rxjs";
import { AllSettledHttpConnection } from "src/app/types/services";

export function allSettledFork(
    observables: Observable<any>[]
): Observable<AllSettledHttpConnection[]> {
    const results: AllSettledHttpConnection[] = [];

    const observableFinished = (observer: any) => {
        observer.next(results);
        observer.complete();
    };

    return new Observable((observer) => {
        observables.forEach((obs, index) =>
            obs.subscribe({
                next: (next) => {
                    results[index] = { status: "fulfilled", value: next };
                },
                error: (error) => {
                    results[index] = { status: "rejected", error: error };
                    observableFinished(observer);
                },
                complete: () => {
                    observableFinished(observer);
                },
            })
        );
    });
}
