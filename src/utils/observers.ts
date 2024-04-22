import { Observable } from "rxjs";

export function allSettledFork(observables: Observable<any>[]) {
    const results: {
        status: "fulfilled" | "rejected";
        value?: any;
        error?: any;
    }[] = [];

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
