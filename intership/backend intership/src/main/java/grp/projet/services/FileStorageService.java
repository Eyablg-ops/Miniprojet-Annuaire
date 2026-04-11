package grp.projet.services;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
        import java.util.UUID;

@Service
public class FileStorageService {

    private static final Path UPLOAD_DIR =
            Paths.get("uploads/postulations");

    public FileStorageService() throws IOException {
        Files.createDirectories(UPLOAD_DIR);
    }

    public String saveFile(MultipartFile file) throws IOException {
        String original = file.getOriginalFilename();
        String ext = (original != null && original.contains("."))
                ? original.substring(original.lastIndexOf("."))
                : "";
        String fileName = UUID.randomUUID() + ext;
        Files.copy(file.getInputStream(),
                UPLOAD_DIR.resolve(fileName),
                StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }
}
