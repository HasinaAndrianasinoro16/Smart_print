import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { getApiUrl } from "../Link/URL";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Modals_create_BonCommande({ facture, onSuccess }) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const getCsrfToken = async () => {
        try {
            await fetch("http://localhost:8000/sanctum/csrf-cookie", {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            return decodeURIComponent(cookieValue || '');
        } catch (error) {
            console.error("CSRF Token Error:", error);
            throw error;
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            setError("Veuillez sélectionner un fichier !");
            return;
        }

        // Validate file size (7MB max)
        if (file.size > 7 * 1024 * 1024) {
            setError("Le fichier est trop volumineux (max 7MB)");
            return;
        }

        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            setError("Type de fichier non valide (PDF, JPG, PNG uniquement)");
            return;
        }

        setIsLoading(true);
        setError(null);
        setUploadProgress(0);

        try {
            const csrfToken = await getCsrfToken();
            const formData = new FormData();
            formData.append("commande", file);
            formData.append("facture", facture);

            const xhr = new XMLHttpRequest();

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(progress);
                }
            };

            const response = await new Promise((resolve, reject) => {
                xhr.open("POST", getApiUrl('boncommandes/add'));
                xhr.setRequestHeader('X-XSRF-TOKEN', csrfToken);
                xhr.setRequestHeader('Accept', 'application/json');
                xhr.withCredentials = true;

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(new Error(xhr.statusText));
                    }
                };

                xhr.onerror = () => reject(new Error("Network Error"));
                xhr.send(formData);
            });

            if (response.success) {
                alert("✅ Fichier envoyé avec succès !");
                if (onSuccess) onSuccess(response.data);
            } else {
                throw new Error(response.message || "Erreur lors de l'envoi");
            }

            return response;
        } catch (error) {
            console.error("Upload Error:", error);
            setError(error.message || "Une erreur est survenue");
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="p-4">
            <div className="row">
                <div className="col-12">
            <div className="mb-4">
                <label className="form-label">Numéro de Facture :</label>
                <InputText
                    value={facture}
                    className="w-100"
                    readOnly
                />
            </div>

            <div className="mb-4">
                <label className="form-label">
                    Fichier Bon de Commande (PDF, JPG, PNG - max 7MB) :
                </label>
                <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                        setFile(e.target.files?.[0] || null);
                        setError(null);
                    }}
                    className="block w-100 text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-md file:border-0
                              file:text-sm file:font-semibold
                              file:bg-blue-50 file:text-blue-700
                              hover:file:bg-blue-100"
                    disabled={isLoading}
                />
            </div>

            {error && (
                <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {error}
                </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-4">
                    <div className="flex justify-between mb-1">
                        <span>Progression :</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="text-center">
                <button
                    className={`px-4 py-2 rounded-md text-white font-medium
                              ${isLoading ? 'bg-info' : 'bg-primary hover:bg-primary-700'}
                              transition-colors duration-200`}
                    onClick={handleFileUpload}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <ProgressSpinner
                                style={{ width: '20px', height: '20px' }}
                                strokeWidth="6"
                                className="mr-2"
                            />
                            Envoi en cours...
                        </span>
                    ) : (
                        <span  >
                            <i className="fas fa-upload mr-2"></i>
                            Envoyer le fichier
                        </span>
                    )}
                </button>
            </div>
            </div>
            </div>
        </div>
    );
}
// import React, { useState } from "react";
// import { InputText } from "primereact/inputtext";
// import { getApiUrl } from "../Link/URL";
//
// export default function Modals_create_BonCommande({ facture }) {
//     const [file, setFile] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//
//     const form_add_facture = async () => {
//         if (!file) {
//             alert("Veuillez sélectionner un fichier !");
//             return;
//         }
//
//         // Validate file size (7MB max)
//         if (file.size > 7 * 1024 * 1024) {
//             alert("Le fichier est trop volumineux (max 7MB)");
//             return;
//         }
//
//         setIsLoading(true);
//
//         const formData = new FormData();
//         formData.append("commande", file);
//         formData.append("facture", facture);
//
//         try {
//             const response = await fetch(getApiUrl('boncommandes/add'), {
//                 method: "POST",
//                 body: formData,
//                 headers: {
//                     'Accept': 'application/json',
//                     // Let browser set Content-Type automatically
//                 },
//             });
//
//             const contentType = response.headers.get('content-type');
//             if (!contentType?.includes('application/json')) {
//                 const text = await response.text();
//                 throw new Error(`Server error: ${text.substring(0, 100)}...`);
//             }
//
//             const data = await response.json();
//
//             if (!response.ok) {
//                 throw new Error(data.message || data.error || "Erreur inconnue");
//             }
//
//             alert("✅ Fichier envoyé avec succès !");
//             return data;
//         } catch (error) {
//             console.error("Erreur:", error);
//             alert(`Erreur: ${error.message}`);
//         } finally {
//             setIsLoading(false);
//         }
//     };
//
//     return (
//         <div>
//             <div className="mb-3">
//                 <label>Numéro de Facture :</label>
//                 <InputText value={facture} className="w-100" readOnly />
//             </div>
//
//             <div className="mb-3">
//                 <label>Fichier Bon de Commande :</label>
//                 <input
//                     type="file"
//                     accept=".pdf,.jpg,.jpeg,.png"
//                     onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
//                     className="form-control"
//                 />
//             </div>
//
//             <div className="text-center">
//                 <button
//                     className="w-50 btn btn-success"
//                     onClick={form_add_facture}
//                     disabled={isLoading}
//                 >
//                     {isLoading ? "Envoi..." : "Ajouter"} <i className="fas fa-plus"/>
//                 </button>
//             </div>
//         </div>
//     );
// }